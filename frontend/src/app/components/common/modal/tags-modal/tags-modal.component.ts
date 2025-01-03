import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediumButtonComponent } from '../../medium-button/medium-button.component';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../../../models/tag';
import { dialogOpenClose } from '../../../../animations/dialog-open-close';
import { fadeInOut } from '../../../../animations/fade-in-out';
import { collapse } from '../../../../animations/collapse';
import { TagService } from '../../../../services/api/tag.service';
import { deleteFromArray } from '../../../../utils/array-utils';

@Component({
  selector: 'app-tags-modal',
  standalone: true,
  imports: [MediumButtonComponent, NgIf, MatIcon, NgForOf, FormsModule],
  templateUrl: './tags-modal.component.html',
  styleUrl: './tags-modal.component.scss',
  animations: [dialogOpenClose, fadeInOut, collapse],
})
export class TagsModalComponent {
  @Input() workoutTags: Tag[] | undefined = [];
  @Output() closeModal = new EventEmitter<void>();

  protected isOpen: boolean = false;

  protected existingTags: Tag[] = [];
  protected isAddExistingTagsSectionOpen: boolean = false;
  protected isAddNewTagSectionOpen: boolean = false;
  protected newTagValue: string = '';

  constructor(private tagService: TagService) {}

  show() {
    this.isOpen = true;
  }

  close() {
    this.closeModal.next();
    this.isAddNewTagSectionOpen = false;
    this.isOpen = false;
    this.isAddExistingTagsSectionOpen = false;
  }

  removeTag(tag: Tag) {
    deleteFromArray(this.workoutTags!, tag);
  }

  openAddExistingTagsSection() {
    this.tagService
      .getExistingTags()
      .subscribe(
        (tags) =>
          (this.existingTags = tags.filter(
            (tag) =>
              !this.workoutTags?.some((workoutTag) => workoutTag.id === tag.id),
          )),
      );

    this.isAddExistingTagsSectionOpen = true;
    this.isAddNewTagSectionOpen = false;
  }

  openAddNewTagSection() {
    this.isAddExistingTagsSectionOpen = false;
    this.isAddNewTagSectionOpen = true;
  }

  addExistingTag(tag: Tag) {
    this.workoutTags?.push(tag);
    deleteFromArray(this.existingTags, tag);
  }

  addNewTag() {
    if (this.newTagValue && this.newTagValue.trim().length > 0) {
      this.workoutTags?.push({ name: this.newTagValue });
      this.newTagValue = '';
    }
  }
}
